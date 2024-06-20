const ExcelMgr = require("../module/ExcelMgr.cjs");



class RunState {
    constructor() {
        this._name = 'RunState';
        this.modules = [ExcelMgr];
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    enter() {
        this.modules.forEach(module => {
            if (module.init)
                module.init();
        });
        this.modules.forEach(module => {
            if (module.start)
                module.start("test");
        });
    }

    exit() {
        this.modules.forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
    }
}
module.exports = RunState;