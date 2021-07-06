import { Photo } from "./model";
import photos from "./schema";
export default class PhotoService {
  public async savePhoto(model: Photo) {
    const _session = new photos(model);
    return await _session.save();
  }

  public async findPaginated(nextPage: number, callback: any) {
    try {
      const perPage = 8;
      const page = Math.max(0, nextPage);
      photos
        .find(callback)
        .limit(perPage)
        .skip(perPage * page);
    } catch (error) {}
  }
  public async deletePhoto(_id: String) {
    const query = { _id: _id };
    return await photos.deleteOne(query);
  }
}
