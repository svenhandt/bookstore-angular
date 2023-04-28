import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CurrentPageService} from "../../services/util/current-page.service";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private currentPageService: CurrentPageService) { }

  ngOnInit(): void {
    this.currentPageService.setCurrentComponentName(this.route.component?.name)
  }

}
