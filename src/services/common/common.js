import Logger from '../../helpers/logger';
import fs from 'fs';
import { RESPONSE_CODES } from '../../../config/constants';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { uploadFlieToAWS } from '../../helpers/commonFunctions'

export default class Common {
  async init(db) {
    this.logger = new Logger();
    await this.logger.init();
    this.Models = db.models;
  }

  async uploadFiles(files, type) {
    try {
      let response = {};
      const uploadedFiles = [];
      for (let ele of files) {
        let data = fs.readFileSync(ele.path)
        fs.unlinkSync(ele.path)
        let params = {
          'Bucket': type && typeof (type) == 'string' ? process.env.AWS_BUCKET + '/' + type : type && type.length > 0 ? process.env.AWS_BUCKET + '/' + type[0] : process.env.AWS_BUCKET,
          // 'Bucket': process.env.AWS_BUCKET,
          'Key': Date.now() + "-" + ele.originalname,
          'Body': data,
          'contentType': ele.mimetype,
          'ACL': 'public-read'
        }
        let result = await uploadFlieToAWS(params)
        ele['location'] = result.Location
        ele['key'] = result.Key
      }
      if (files) {
        if (files.length > 0) {
          files.forEach((file) => {
            const upload = {
              path: file.location,
              type: file.mimetype,
              name: file.originalname,
              file_key: file.key
            };
            uploadedFiles.push(upload);
          });
        }
      }
      response.status = 1;
      response.code = RESPONSE_CODES.POST;
      response.message = CUSTOM_MESSAGES.FILE_UPLOADED;
      response.data = uploadedFiles;
      return response;
    } catch (error) {
      this.logger.logError('Upload File Error: ', error);
      throw error;
    }
  };
}