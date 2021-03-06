const express = require('express')
var cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths =  {
            apiV1:      '/api/v1',
            auth:       '/api/v1/auth',
            buscar:     '/api/v1/buscar',
            categorias: '/api/v1/categorias',
            productos:  '/api/v1/productos',
            uploads: '/api/v1/uploads'
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
        
    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.apiV1, require('../routes/user.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;