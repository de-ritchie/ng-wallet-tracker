import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {
    console.log("Auth Service init");
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (true) return true;

    this.router.navigate(["/"]);
    return false;
  }
}
