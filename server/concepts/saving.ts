import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface SaveDoc extends BaseDoc {
  author: ObjectId;
  name: string;
  items: Array<ObjectId>;
}

/**
 * concept: Saving [Post]
 */
export default class SaveConcept {
  public readonly saved: DocCollection<SaveDoc>;
  constructor(collectionName: string) {
    this.saved = new DocCollection<SaveDoc>(collectionName);
  }

  async create(author: ObjectId, name: string) {
    const items = new Array<ObjectId>();
    const _id = await this.saved.createOne({ author, name, items });
    return { msg: `Save ${name} successfully created!`, save: await this.saved.readOne({ _id }) };
  }

  async save(_id: ObjectId, item: ObjectId) {
    const save = await this.saved.readOne({ _id });
    if (!save) {
      throw new NotFoundError(`Save ${_id} does not exist!`);
    }
    save.items.push(item);
    const items = save.items;
    await this.saved.partialUpdateOne({ _id }, { items });
    return "Successfully saved!";
  }

  async getByAuthor(author: ObjectId) {
    return await this.saved.readMany({ author });
  }
  async deleteItem(item: ObjectId) {
    let saved = await this.saved.readMany({ items: item });
    console.log(saved);
    for (let save of saved) {
      let index = save.items.indexOf(item);
      save.items.splice(index, 1);
      console.log(save.items);
      console.log(save._id);
      let _id = save._id;

      await this.saved.partialUpdateOne({ _id }, { items: save.items });
    }
  }
  async getSaved() {
    return await this.saved.readMany({}, { sort: { _id: -1 } });
  }

  async getSave(author: ObjectId, name: string) {
    const save = await this.saved.readOne({ author, name });
    if (!save) {
      throw new NotFoundError(`Save does not exist!`);
    }

    return save;
  }

  async getNames(author: ObjectId) {
    const names = await this.saved.readMany({ author });
    return names.map((item) => item.name);
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {}

  async assertCanSave(name: string, item: ObjectId, author: ObjectId) {
    const save = await this.saved.readOne({ author, name });
    if (!save) {
      throw new NotFoundError(`Save does not exist!`);
    }
    if (save.items.toString().includes(item.toString())) {
      throw new NotAllowedError(`Item is already saved!`);
    }
  }
}

export class SaveAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of save group {1}!", author, _id);
  }
}
