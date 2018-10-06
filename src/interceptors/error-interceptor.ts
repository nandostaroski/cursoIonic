import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from "../models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(
        public storage: StorageService,
        public alertCtrl: AlertController) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error,caught) => {
            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }
            console.log('erro interceptado');
            console.log(errorObj);

            switch(errorObj.status) {
                case 401:
                this.handle401();
                break;
                
                case 403:
                console.log('handle403');
                this.handle403();
                break;

                case 422:
                this.handle422(errorObj);
                break;

                default:
                this.handleDefault(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handle422(errorObj: any) {
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação',
            message: this.listErros(errorObj.errors),
            enableBackdropDismiss: false,
            buttons:[
                {text:'Ok'}
            ]
        });
        alert.present();
    }

    listErros(messages: FieldMessage[]): string {
        let s: string = '';
        for (let i=0; i < messages.length; i++) {
            s = `${s}<p><strong>${messages[i].fieldName}</strong>: ${messages[i].message}`;
        }
        return s;
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons:[
                {text:'Ok'}
            ]
        });
        alert.present();
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handleDefault(errorObj: any) {
        let alert = this.alertCtrl.create({
            title: 'Erro '+errorObj.status + ': '+errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons:[
                {text:'Ok'}
            ]
        });
        alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};