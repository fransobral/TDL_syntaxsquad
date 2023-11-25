import * as fs from 'fs';

export class DataBase {
    private file_name: string;

    constructor() {
        this.file_name = "database.txt";

        if (!fs.existsSync(this.file_name)) {
            fs.writeFileSync(this.file_name, "", 'utf-8');
        }
    }

    public getFileName() {
        return this.file_name;
    }

    private validateContent(txt: any): txt is string {
        return typeof txt === 'string' && txt.trim() !== '';
    }

    public readFile() {
        let exist = true;

        if (!fs.existsSync(this.file_name)) {
            console.log("File: " + this.file_name + " does not exist.");
            exist = false;
        }

        return exist ? fs.readFileSync(this.file_name, 'utf-8') : "";
    }

    public writeFile(file_content = "") {
        if (!this.validateContent(file_content)) return;

        if (!fs.existsSync(this.file_name)) console.log("File: " + this.file_name + " does not exist.");

        console.log('Creating file....');

        fs.writeFileSync(this.file_name, file_content, 'utf-8');

        console.log('File created successfully.  =)');
    }
}