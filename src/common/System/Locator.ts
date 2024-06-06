export class Locator {
  private static instances: Map<string, any> = new Map();
  public static register<T>(classRef: new () => T, module: any): void {
    const className = classRef.name;
    this.unregister(classRef);
    this.instances.set(className, module);
  }

  public static unregister<T>(classRef: new () => T): void {
    const className = classRef.name;
    // 检查实例是否已经存在于Map中
    if (this.instances.has(className)) {
      // 如果存在，则删除实例
      this.instances.delete(className);
    }
  }

  public static fetch<T>(classRef: new () => T): T {
    const className = classRef.name;
    if (!this.instances.has(className)) {
      throw new Error('Instance not found');
    }
    return this.instances.get(className);
  }
}
