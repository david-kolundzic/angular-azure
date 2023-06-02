import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, of,switchMap,tap } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor(private httpClient: HttpClient) { }

  files: any = [
    // tslint:disable-next-line: max-line-length
    {
      url:
        "https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3",
      name: "Perfect",
      artist: " Ed Sheeran"
    },
    {
      // tslint:disable-next-line: max-line-length
      url:
        "https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3",
      name: "Man Atkeya Beparwah",
      artist: "Nusrat Fateh Ali Khan"
    },
    {
      url:
        "http://live.antenazagreb.hr:8002/;",
      name: "Antena",
      artist: "Razni"
    }
  ];
  getRadiostatinInfo():Observable<any>{
    return this.httpClient.head('http://live.narodni.hr:8039/currentsong?sid=#')
  }
  getInfos(){
    return this.httpClient.get('http://s8.iqstreaming.com:8022/currentsong?sid=#');
  }
  getTitle(url: string): Observable<any> {
    
    return this.httpClient.get(url, { responseType: 'text' })
  }
  getSongInfo(title: string): Observable<any> {
    //var defaultApi = "https://192.168.1.5:45455/api/radiostanicas/gettitle?title="
    var defaultApi = "/api/radio/gettitle?title="
    return this.httpClient.get(`${defaultApi}${title}`);
  }
  getInfo(url:string):Observable<any>{
    var defaultApi = "https://localhost:5002/api/radiostanicas/gettitle?link="
    return this.httpClient.get(`${defaultApi}${url}`);
  }
  getRadioStations()
  {
   return  this.httpClient.get<any[]>('assets/radio-stanice.json')
   .pipe(
      map( (radioStations:any) => radioStations.map((r: any) => (
          {
            ...r,
            homepage: r.homepage.trim(),
            tagsarray: r.tags ? r.tags.split(',') : []
          }
        )),
        
        ),
      tap((d:any) => console.log(d)),
    )
   
  }
  getTest() {
    return this.httpClient.get('api/RadioStationsApi')
      .pipe();
  }
  getFiles() {
    return of(this.files);
  }
}
