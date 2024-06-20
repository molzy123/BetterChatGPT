


class StateMachine {
    constructor() {
        this.stateMap = {}
        this.current = null
    }

    // add state
    addState(state) {
        this.stateMap[state.name] = state
    }

    // get state
    getState(name) {
        return this.stateMap[name]
    }

    // remove state
    removeState(name) {
        delete this.stateMap[name]
    }

    // switch state
    switchState(name) {
        if (this.current) {
            this.current.exit()
        }
        this.current = this.stateMap[name]
        this.current.enter()
    }

}

module.exports = StateMachine