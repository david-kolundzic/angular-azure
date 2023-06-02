import { Injectable } from '@angular/core';
// import { StreamState } from 'http2';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { StreamState } from '../_models/stream-state';
import * as moment from 'moment';
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject<void>();
  private audioObj = new Audio();
  
  audioEvents=[
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart",
  
  ]
  
  private state: StreamState= {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    loadedmetadata:''
  }
  //state: StreamState;
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state)

  
  constructor() { }

  

  private streamObservable(url:any){
    return new Observable(observer =>{
      console.log("Stream observable> ", url)
      // play audio 
      this.audioObj.src = url;
      console.log(this.audioObj)
      this.audioObj.load();
      this.audioObj.play();
      

      const handler = (event: Event)=>{
        this.updateStateEvents(event)
        observer.next(event);
      }
      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // STOP PLAYING
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // REMOVE EVENT LISTENERS
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // RESET STATE
        this.resetState();
      }

    })
  }
  private updateStateEvents(event: Event): void {
    
    switch (event.type) {
      case "canplay":
        this.state.duration= this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
    
      case "playing":
        this.state.playing = true;
        break;
    
      case "pause":
        this.state.playing= false;
        break;
      
        case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime)
        break;
        case"loadedmetadata":
        break;
        case "error":
        this.resetState();
        this.state.error=true;
        break;
      
      default:
        break;
    }
    this.stateChange.next(this.state);
  }

  play(){
    this.audioObj.play();
  }
  pause(){
    this.audioObj.pause();
  }
  stop(){
    this.stop$.next();
  }
  seekTo(seconds:number){
    this.audioObj.currentTime=seconds;
  }

 

  addEvents(audioObj: HTMLAudioElement, audioEvents: string[], handler:any) {
    audioEvents.forEach(event => {
      audioObj.addEventListener(event, handler)
    })
  }
  playStream(url:string){
    return this.streamObservable(url).pipe(takeUntil(this.stop$))
  }

  private removeEvents(obj:HTMLAudioElement, events: string[], handler:any){
    events.forEach(ev => {
      obj.removeEventListener(ev, handler)
    })
  }

  resetState(){
    this.state= {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    } as StreamState
  }
  getState(): Observable<StreamState>{

    return this.stateChange.asObservable();
  }

  formatTime(time: number, format: string = "HH:mm:ss"){
    const momentTime = time * 1000
    return moment.utc(momentTime).format(format);
  }

}
