import { Component, Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

// import { debounceTime } from 'rxjs/operators';
// import { distinctUntilChanged } from 'rxjs/operators';




class SearchItem{
  //static map: any;


  constructor(public name: string,
    public artist:string,
    public link: string,
    public thumbnail:string,
    public artistId:string){
    

  }
}

@Injectable()
 class SearchService{


  apiRoot:string =`https://itunes.apple.com/search`;
  results:Object[];
  loading:boolean;
  
  constructor(private http:HttpClient){
    this.results= [];
    this.loading=false;
  }
  search(term: string){
    let promise = new Promise((resolve, reject) =>{
      let apiUrl = `${this.apiRoot}?term=${term}&medis=music&limit=20`;
      this.http.get(apiUrl)
      .toPromise()
      .then(
        res => {
          return JSON.stringify(this.results);
         
        },
        msg => {
          reject(msg);
        }
      )
    });
    return promise;
  }

   search3(term: string):Observable<any>{

    let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      return this.http.get(apiURL)
        .pipe(map(res => {
          return JSON.stringify(this.results);
        }));
  }  
/*   search2(term: string):Observable<SearchItem[]>{

    let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=2&callback=JSONP_CALLBACK`;
      return this.http.get(apiURL)
        .pipe(map(res => {
       
          return SearchItem.map(item => { 
            return new SearchItem( 
                item.name,
                item.artist,
                item.link,
                item.thumbnail,
                item.artistId
            );
          });
          //console.log(res.toString());
      }));
    } 
 } */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[SearchService]
})


/* 
//we subscribe to Observable and save the results locally on our AppComponent
export class AppComponent {
  private loading:boolean=false;
  public results: SearchItem[];
  constructor(private itunes:SearchService) { }

  doSearch(term:string) {
    //this.itunes.search2(term)  for promise

    this.loading=true;
    this.itunes.search2(term).subscribe((data) =>{
      this.loading=false;
      this.results=data;
    });
  }*/
} 

//using async pipe in our template, save results propery, we subscribe and rendering it on screen itself, not storing it
//in our component
export class AppComponent {
  private loading:boolean=false;
  public results: Observable<SearchItem[]>;
  private search:FormControl;
  constructor(private itunes:SearchService) { }
/* 
   ngOnInit() {
    this.search = new FormControl();
    this.search.valueChanges
      .pipe(debounceTime(400)
      .distinctUntilChanged()
      .map( term => this.itunes.search(term))
      .subscribe( value => {
        value.subscribe( other => console.log(other) )
      }));
  }  */

/* ngOnInit() {
    this.search = new FormControl();
    this.search.valueChanges
      .pipe(debounceTime(400)
      .distinctUntilChanged()
      .do(()=>this.loading=true)
      //.map( term => this.itunes.search(term))
      .switchMap( term => this.itunes.search(term))
     // .subscribe( value => console.log(value) ) 
     .do(()=>this.loading=false));
      } */
  
  doSearch(term:string) {
    //this.itunes.search2(term)  for promise

    this.loading=true;
    this.results = this.itunes.search3(term);
    //.subscribe((data) =>{
     // this.loading=false;
      //this.results=data;
   // });
  }
}

