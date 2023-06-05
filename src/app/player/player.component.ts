import { Component, OnInit } from '@angular/core';

import { AudioService } from '../_services/audio.service';
import { CloudService } from '../_services/cloud.service';
import { StreamState } from '../_models/stream-state';

import { XMLParser } from 'fast-xml-parser';
import { interval, Subscription, switchMap, take, timer } from 'rxjs';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  files: Array<any> = [
    { name: 'First Song', artist: 'Inder' },
    { name: 'Second Song', artist: 'You' },
  ];
  radioStations?: any[];
  state?: StreamState;
  currentFile: any = {};
  selected?: number;
  songTitle?: string = "";
  author?: string = "";
  songThumb?: string = "";

  option1 = { duration: 500 };
  option2 = { duration: 1000, easing: 'easeOutQuart' };
  option3 = { easing: 'linear' };
  option4 = { duration: 700, easing: 'easeInCubic', offset: -50 };

  errorQuota = false;

  timerepeat = interval(5000);
  intervalSubscription: Subscription = new Subscription();

  constructor(
    private audioService: AudioService,
    private cloudService: CloudService,
    // private smoothService: SmoothScrollService
  ) {
    this.cloudService.getFiles().subscribe((files) => {
      this.files = files;
    });
    // listen to stream state
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }


  ngOnInit(): void {
    // get media files

    this.cloudService.getRadioStations().subscribe((stations) => {
      this.radioStations = stations;
    });
    // this.smoothService.smoothScrollToAnchor();

  }
  openFile(file: any, index: any) {
    this.selected = index;
    this.currentFile = { file, index };
    this.audioService.stop();
    this.playStream(file.url_resolved);
  }

  playStream(urlString: string) {
    this.intervalSubscription.unsubscribe();
    this.timerepeat;
    this.songTitle = "";
    this.author = "";
    this.songThumb = "";
    
    // this.audioService.playStream(urlString.replace('http://', '/broadcast/')).subscribe((ev) => {
    this.audioService.playStream(urlString.replace('http:','')).subscribe((ev) => {
      // console.log("PLAY")
      // console.log(ev);


    });
    var url = new URL(urlString);   
    let currentTitle = "empty";

    this.intervalSubscription = timer(0, 5000).pipe(
      switchMap(() => this.cloudService.getTitle(url.origin.replace('http://', '/broadcast/').replace('/;', '') + "/stats?sid=1"))
    ).subscribe({
      next: xml => {
        //console.log("Get song title")
        //console.log(xml)
        const parser = new XMLParser();
        let json = parser.parse(xml)
        //console.log("Parsed json.")
        //console.log(json);
        
        
        const isNewSongDisplayed = currentTitle !== json.SHOUTCASTSERVER.SONGTITLE;
        currentTitle = json.SHOUTCASTSERVER.SONGTITLE;
        if ((isNewSongDisplayed && json.SHOUTCASTSERVER.SONGTITLE) || (currentTitle === "empty" || this.errorQuota)) {
          this.songTitle = json.SHOUTCASTSERVER.SONGTITLE.split('-')[1];
          this.author = json.SHOUTCASTSERVER.SONGTITLE.split('-')[0];
          this.getSongTitle(`${currentTitle}`);
        
          
        }
        if (!this.songTitle) {
          console.log("SONG TITLE PRAZAN")
          this.intervalSubscription.unsubscribe()
        };       
      },
      error: err => {
        console.log("Error u dohvatu title info!");
        console.log(err);
      }
    })



    // this.getSongTitle(`${url.replace(';','')}currentsong?sid=#`)

  }
  getSongTitle(name: string) {
    console.log("Get song title", name);
    this.cloudService.getSongInfo(name).subscribe({
      next: s => {       
        console.log("Dohvatio sam sa servera! ");
        console.log(s)
        if (s.data) {
          this.songThumb = s.data[0].album.cover_big;
         // this.songTitle = s.data[0].title_short;
         // this.author = s.data[0].artist.name;
          this.errorQuota = false;
        }

        if (s.error.code === 404) this.errorQuota = true;        
      },
      error: err => {
       // this.errorQuota = true;
        this.errorQuota = true;
        console.log("error")
        console.log(err);

      }
    })
  }
  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  play() {
    this.audioService.play();
    this.radioStations ? this.radioStations[this.selected ?? 0].url_resolved : undefined;
    //this.getSongTitle('https://localhost:44328/api/radiostanicas/gettitle?link=http://live.narodni.hr:8039/currentsong?sid=#')
  }
  pause() {
    this.audioService.pause();
  }
  stop() {
    this.audioService.play();
  }

  next() {
    this.selected = this.selected ? this.selected + 1 : 0;

    // this.smoothService.smoothScrollToAnchor(this.option2 as ISmoothScrollOption, "radio-"+ this.selected)

    const url = this.getUrlForSelected();
    this.playStream(url);
  }
  previous() {
    this.selected = this.selected ? this.selected - 1 : 0;
    const url = this.getUrlForSelected();
    this.playStream(url);
  }
  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }
  getUrlForSelected() {
    return this.radioStations ? this.radioStations[this.selected ?? 0].url_resolved : undefined;
  }
  getScrollTo(): string {
    return `radio-${this.selected ? this.selected + 1 : 0}`;
  }
}
