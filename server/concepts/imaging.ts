import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";
export interface ImageDoc extends BaseDoc {
  url: string;
  name: string;
}

/**
 * concept: Posting [Author]
 */
export default class ImagingConcept {
  public readonly images: DocCollection<ImageDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.images = new DocCollection<ImageDoc>(collectionName);
  }

  async create(url: string, name: string) {
    const _id = await this.images.createOne({ url: url, name: name });
    return { msg: "Image successfully created!", image: await this.images.readOne({ _id }) };
  }

  async getImage(name: string) {
    return await this.images.readOne({ name });
  }
  async getImages() {
    return await this.images.readMany({}, { sort: { _id: -1 } });
  }
  async getURL(name: string) {
    const image = await this.images.readOne({ name });
    if (!image) {
      throw new NotFoundError(`Image ${name} does not exist!`);
    }
    return image.url;
  }
}
