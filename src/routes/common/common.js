import commonController from '../../controllers/common/common';
import multer from 'multer';
import path from 'path'

export default class Common {
    constructor(router, db) {
        this.router = router;
        this.db = db;
        this.commonInstance = new commonController();
        this.upload = multer({ dest: path.join(__dirname+'/upload_files')})
    }

    async routes() {
        await this.commonInstance.init(this.db);

        /*** user doc upload ***/
        this.router
            .route('/upload')
            .post( this.upload.array('files'), (req, res) => this.commonInstance.uploadFiles(req, res));
    }
}
