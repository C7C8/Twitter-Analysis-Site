import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { User } from '../../types';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'twittalyzer-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentUser = '';
  users: User[] = [];
  userForm = new FormControl();
  filteredUsers: Observable<User[]>;
  analyzing = false;

  constructor(private dserv: DataService, private snackbar: MatSnackBar, private router: Router) { }

  async ngOnInit() {
    const response = await this.dserv.getUserList();
    if (response.status !== 'error') {
      this.users = response.users;
    }

    this.filteredUsers = this.userForm.valueChanges.pipe(
      startWith(''), map(value => this.filter(value))
    );
  }

  async doSearch() {
    this.analyzing = true;
    const response = await this.dserv.anaylzeUser(this.currentUser);
    this.analyzing = false;

    console.log(response);
    if (response.status === 'error') {
      this.snackbar.open(response.message, '', {duration: 2500});
    }
  }

  filter(input: string): User[] {
    return this.users.filter(x => x.username.toLowerCase().includes(input.toLowerCase()));
  }
}
