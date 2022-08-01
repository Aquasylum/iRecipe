import { Component, OnInit } from '@angular/core';
import { MenuType } from 'src/app/enums/MenuType';

@Component({
  selector: 'irecipe-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css'],
})
export class SectionListComponent implements OnInit {
  constructor() {}

  menu = Object.values(MenuType);
  selectedMenuOption: number = 0;

  ngOnInit(): void {}

  onSelectMenuOption(selector: number): void {
    this.selectedMenuOption = selector;
  }
}
