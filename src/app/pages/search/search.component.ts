import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { User } from '../../types';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'twittalyzer-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentUser: string;
  users: User[] = [];
  userForm = new FormControl();
  filteredUsers: Observable<User[]>;

  constructor(private dserv: DataService) { }

  async ngOnInit() {
    const response = await this.dserv.getUserList();
    if (response.status !== 'error') {
      this.users = response.users;
    }

    this.filteredUsers = this.userForm.valueChanges.pipe(
      startWith(''), map(value => this.filter(value))
    );
  }

  doSearch(): void {
  }

  filter(input: string): User[] {
    return this.users.filter(x => x.username.toLowerCase().includes(input.toLowerCase()));
  }
}
