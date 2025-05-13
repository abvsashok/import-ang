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
      name: 'address'
    },
    {
      name: 'city'
    },
    {
      name: 'state'
    },
    {
      name: 'zip'
    },
    {
      name: 'country'
    },
    {
      name: 'CompanyName'
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
