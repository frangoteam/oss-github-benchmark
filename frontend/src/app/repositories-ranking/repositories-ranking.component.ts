import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService, IData } from 'src/app/data.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IInstitution } from 'src/app/interfaces/institution';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-repositories-ranking',
  templateUrl: './repositories-ranking.component.html',
  styleUrls: ['./repositories-ranking.component.scss'],
})
export class RepositoriesRankingComponent implements OnInit {
  item: IInstitution;
  displayedColumns: any[] = [
    ['name', 'Name', false, 'string'],
    ['last_years_commits', 'Commits last year', false, 'number'],
    ['comments', 'Comments', false, 'number'],
    ['issues_all', 'Issues', false, 'number'],
    ['pull_requests_all', 'Pull requests', false, 'number'],
    ['num_commits', 'Commits', false, 'number'],
    ['num_contributors', 'Contributors', false, 'number'],
    ['num_forks', 'Forks', false, 'number'],
    ['num_stars', 'Stars', false, 'number'],
    ['has_own_commits', 'Has own commits?', true, 'string'],
    ['fork', 'Is fork?', true, 'string'],
  ];
  displayedColumnsOnlyNames = this.displayedColumns.map((column) => column[0]);

  @Input() data: IData;
  dataSource: any = new MatTableDataSource();
  numRepositories: number;
  state: Date;
  repositories: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.loadData().then((data) => {
      let institutions = Object.entries(data.jsonData).reduce(
        (previousValue, currentValue) => {
          const [key, value] = currentValue;
          return previousValue.concat(value);
        },
        []
      );
      this.state = institutions[0].timestamp;
      institutions.forEach((institution) => {
        institution.repos.forEach((repository) => {
          this.repositories.push(repository);
        });
      });
      this.dataSource = new MatTableDataSource(this.repositories);
      this.numRepositories = this.repositories.length;
      console.log(this.displayedColumnsOnlyNames);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
}
