type Classes = string | string[];

export class ClassList {
    protected classes: string[];

    constructor(classes: Classes = []) {
        this.classes = this.classesToArray(classes);
    }

    public static make(classes: Classes = []): ClassList {
        return new ClassList(classes);
    }

    public replace(key: string, value: string): ClassList {
        delete this.classes[this.classes.indexOf(key)];

        this.merge(value);

        return this;
    }

    public merge(classes: Classes | null = null): string {
        if (classes === null) {
            return this.toString(this.classes);
        }

        classes = this.classesToArray(classes);
        classes = [...new Set(this.classes.concat(...classes))];

        this.classes = classes;

        return this.toString(classes)
    }

    public class(): string {
        return this.toString(this.classes);
    }

    private classesToArray(classes: Classes): string[] {
        if (typeof classes === "string") {
            return classes.split(' ');
        }

        return classes;
    }

    private toString(classes: string[]): string {
        return classes.join(' ');
    }
}