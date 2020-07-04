import { Controller, Get, Inject, OnApplicationBootstrap, Post, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { OmexFile } from './types/omex-file/omex-file';
import { SimulationSpec } from './types/simulation-spec/simulation-spec';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import path from 'path';

@Controller()
export class AppController implements OnApplicationBootstrap {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    ) {}

    @Post('dispatch')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: OmexFile, @Body() simSpec: SimulationSpec) {
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    const fileStorage = process.env.FILE_STORAGE;
    const omexStorage = `${fileStorage}/OMEX/ID`;

    // Get existing filetype
    // Generate a unique filename
    const uniqueFilename = `${uuid()}.omex`;
    const omexSavePath = path.join(omexStorage, uniqueFilename);
    

    // Fill out info from file that will be lost after saving in central storage
    simSpec.filename = file.originalname;
    simSpec.uniqueFilename = uniqueFilename;
    simSpec.filepathOnDataStore = omexSavePath;

    // Save the file
    fs.writeFileSync(omexSavePath, file.buffer);

    this.messageClient.send('dispatch', simSpec).subscribe(
      res => {
        this.logger.log(JSON.stringify(res));
      },
      err => {
        this.logger.log('Error occured in dispatch service: ' + JSON.stringify(err));
      }
    );
    
    return {
      message: 'File uploaded successfuly',
      data: {
        filename: uniqueFilename
      }
    }
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}