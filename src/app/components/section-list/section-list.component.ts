import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuType } from 'src/app/enums/MenuType';

@Component({
  selector: 'irecipe-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css'],
})
export class SectionListComponent implements OnInit {
  constructor() {}

  @Output() viewBy = new EventEmitter<string>();
  menu = Object.values(MenuType);
  selectedMenuOption: number = 0;

  ngOnInit(): void {
    this.viewBy.emit(this.menu[0]);
  }

  onSelectMenuOption(selector: number): void {
    this.selectedMenuOption = selector;
    this.viewBy.emit(this.menu[selector]);
  }
}
