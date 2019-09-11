import { Injectable } from '@angular/core';
import { QueryBuilder, QueryMatch, QueryParam } from '../models/QueryBuilder';
import { Subject } from 'rxjs';
import { NetworkService } from './network.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  private queryBuilderObject: QueryBuilder = new QueryBuilder();
  public queryBuilderSub = new Subject<QueryBuilder>();
  private resultSub = new Subject();

  constructor(private http: HttpClient) { }

  getCurrentObject() {
    if (!this.queryBuilderObject) {
      this.queryBuilderObject = new QueryBuilder();
      return this.queryBuilderObject;
    } else {
      return this.queryBuilderObject;
    }
  }

  resetObject() {
    delete this.queryBuilderObject;
    this.queryBuilderObject = new QueryBuilder();
  }

  getUpdatedObject() {
    return this.queryBuilderSub.asObservable();
  }

  updateQueryMatch(connection, queryMatch) {
    this.queryBuilderObject[connection] = queryMatch;
    this.queryBuilderSub.next(this.queryBuilderObject);
  }

  addProcessParam(process, queryParam) {
    this.queryBuilderObject[process].push(queryParam);
    this.queryBuilderSub.next(this.queryBuilderObject);
  }

  updateProcessParam(process, index, queryParam) {
    this.queryBuilderObject[process][index] = queryParam;
    this.queryBuilderSub.next(this.queryBuilderObject);
  }

  removeProcessParam(process, queryParam) {
    this.queryBuilderObject[process] = this.queryBuilderObject[process]
      .filter(param => param !== queryParam);
    this.queryBuilderSub.next(this.queryBuilderObject);
  }

  getSearchResults() {
    return this.resultSub.asObservable();
  }

  setSearchResults(result) {
    this.resultSub.next(result);
  }

  submitQuery() {
    return this.http.post<any>('https://psnov1.lbl.gov:8082/generix/search', this.queryBuilderObject);
  }


}
