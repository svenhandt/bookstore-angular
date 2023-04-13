
export class CategoryModel {

  public key: string
  public name: string
  public description: string


  constructor(key: string, name: string, description: string) {
    this.key = key;
    this.name = name;
    this.description = description;
  }
}
