import { Request, Response } from "express";
import * as fs from "fs";
import { successResponse } from "../modules/common/service";
import { Photo } from "../modules/photos/model";
import PhotoService from "../modules/photos/service";
// @ts-ignore
const imagemin: any = require("imagemin");
import mozjpeg from "imagemin-mozjpeg";
import sharp from "sharp";
const isJpg = require("is-jpg");
const imageToBase64 = require("image-to-base64");

export default class PhotoController {
  private photoService = new PhotoService();

  public async savePhoto(req: Request, res: Response) {
    const files: any = req.files;

    let newFiles = await imagemin(["uploads/*.{jpeg,png,jpg}"], {
      destination: "build/images",
      plugins: [this.convertToJpg, mozjpeg({ quality: 60 })],
    });

    files.forEach((file: any) => fs.unlinkSync(file.path));
    newFiles = this.shuffleFisherYates(newFiles);
    this.proccessPhotos(newFiles, 0, res);
  }

  convertToJpg = async (input: Buffer) => {
    if (isJpg(input)) {
      return input;
    }

    return await sharp(input).jpeg().toBuffer();
  };

  private async proccessPhotos(
    list: Array<any>,
    lastIndex: number,
    res: Response
  ) {
    if (list.length == lastIndex) {
      successResponse("ALL IMAGES PROCESSED", null, res);
      return;
    }

    setTimeout(async () => {
      try {
        const file = list[lastIndex];
        let response = await imageToBase64(file.destinationPath);
        let photo: Photo = {
          base64: response,
          filename: file.destinationPath.split("/")[2],
        };
        await this.photoService.savePhoto(photo);
        fs.unlinkSync(file.destinationPath);
        lastIndex++;
      } catch (error) {}
      this.proccessPhotos(list, lastIndex, res);
    }, 200);
  }

  public async findPaginated(req: Request, res: Response) {
    this.photoService.findPaginated(
      Number(req.query["page"]),
      (err: any, docs: any) => {
        successResponse("", docs, res);
      }
    );
  }

  private shuffleFisherYates(array: Array<any>) {
    let i = array.length;
    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
  }
}
