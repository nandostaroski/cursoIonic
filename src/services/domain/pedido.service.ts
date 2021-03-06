import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PeditoDTO } from "../../models/pedido.dto";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class PedidoService {
    constructor(public http: HttpClient) {
    }

    insert(obj: PeditoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}