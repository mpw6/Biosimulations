import { RemoteFile } from '../Models/remote-file';
import { License } from '../Models/license';

import { AccessLevel } from '@biosimulations/datamodel/core';
import { Person } from '../Models/person';
import { JournalReference } from '../Models/journal-reference';
import { TopLevelResource } from '../Models/top-level-resource';
import { UserSerializer } from '../Models/user';
import { environment } from '../../../environments/environment';
import { Identifier } from '../Models/identifier';

export class Serializer<T extends TopLevelResource> {
  userSerializer: UserSerializer;
  type: new () => T;
  constructor(type: new () => T) {
    this.userSerializer = new UserSerializer();
    this.type = type;
  }
  fromJson(json: any): T {
    const topLevelResource = new this.type();
    topLevelResource.id = json.id;
    // Simple, one to one corresponding feilds
    topLevelResource.id = json.id;
    topLevelResource.name = json.name;

    topLevelResource.description = json.description;
    topLevelResource.accessToken = json.accessToken;
    topLevelResource.tags = json.tags;
    topLevelResource.created = new Date(Date.parse(json.created));
    topLevelResource.updated = new Date(Date.parse(json.updated));
    topLevelResource.license = json.license as License;
    topLevelResource.identifiers = [];
    for (const identifier of json?.identifiers) {
      topLevelResource.identifiers.push(new Identifier(identifier));
    }
    // Owner if embedded
    if (typeof json.owner === 'string') {
      topLevelResource.ownerId = json.owner;
    } else if (typeof json.owner === 'object' && json.owner !== null) {
      topLevelResource.owner = this.userSerializer.fromJson(json.owner);
      topLevelResource.ownerId = topLevelResource.owner.userName;
    }
    if (json.private) {
      // Boolean
      topLevelResource.access = AccessLevel.private;
    } else {
      topLevelResource.access = AccessLevel.public;
    }

    if (json.authors) {
      topLevelResource.authors = [];
      for (const author of json.authors) {
        topLevelResource.authors.push(
          new Person(author.firstName, author.middleName, author.lastName),
        );
      }
    }
    topLevelResource.refs = [];
    if (json.references) {
      for (const reference of json.references) {
        topLevelResource.refs.push(new JournalReference(reference));
      }
    }

    topLevelResource.image = new RemoteFile(
      (json.name as string) + ' Thumbnail',
      json.image,
      topLevelResource.ownerId,
      topLevelResource.access === AccessLevel.private,
      'xml',
      environment.crbm.CRBMAPI_URL + '/files/' + json.image + '/download',
    );

    const resource = topLevelResource as T;
    return resource;
  }
  toJson(resource: TopLevelResource): any {
    const keys = ['id', 'name', 'description', 'tags', 'accessToken'];
    const json = {};
    for (const key of keys) {
      json[key] = resource[key];
    }
    json['owner'] = resource['ownerId'];
    json['image'] = resource['image']?.id;
    const identifers = [];
    for (const identifier of resource?.identifiers) {
      identifers.push(identifier.serialize());
    }
    json['identifiers'] = identifers;
    json['references'] = [];
    for (const reference of resource.refs) {
      json['references'].push(reference.serialize());
    }
    json['authors'] = [];
    for (const person of resource.authors) {
      const cast = person as Person;
      json['authors'].push(cast);
    }
    if (resource?.access === AccessLevel.private) {
      json['private'] = true;
    } else {
      json['private'] = false;
    }
    json['license'] = resource?.license;
    json['created'] = resource?.created.toISOString();
    json['updated'] = resource?.created.toISOString();

    return json;
  }
}