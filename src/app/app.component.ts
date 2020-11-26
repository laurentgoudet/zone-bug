import { Component, OnInit, NgZone, Testability } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'zone-bug';

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private testability: Testability,
  ) {}

  ngOnInit() {
    // This gets blocked by the browser due to CORS, i.e. returning status ===
    // 0 similarly to client-side request blocking (ad-blockers)
    this.http.get('https://example.com')
      .toPromise().then(response => {
        console.log(response);
      });

    // This 500
    this.http.get('https://run.mocky.io/v3/f075992d-e33e-4441-8b66-cb18901105df')
      .toPromise().then(response => {
        console.log(response);
      });

    this.testability.whenStable(
      (e: any) => {
        console.log('App is stable');
      },
      0,
      (pendingTasks: any) => {
        console.warn(
          'Pending tasks blocking zone stabilization:',
          pendingTasks,
        );
      }
    );
  }
}
