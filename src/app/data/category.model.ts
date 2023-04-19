
export class CategoryModel {

  public id: string
  public key: string
  public name: string
  public description: string


  constructor(id: string, key: string, name: string, description: string) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.description = description;
  }
}
