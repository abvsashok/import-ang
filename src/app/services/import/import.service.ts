import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  fields = [
    {
      name: 'name',
      required: true
    },
    {
      name: 'email',
      required: true
    },
    {
      name: 'phone',
      required: true
    },
    {
      name:"corporateName",
      required: true,
    },
    {
      name: 'companyName'
    },
    {
      name: 'companyGroup'
    },
    {
      name: 'companyGroupId',
      required: true,
    },
    {
      name: 'address'
    },
    {
      name: 'city'
    },
    {
      name: 'state'
    },
    {
      name: 'postalCode'
    },
    {
      name: 'country'
    },

    {
      name: 'Department'
    },
    {
      name: 'id'
    },
    {
      name: 'location'
    }
  ]

  constructor() { }
}
