interface IState {
    name: string
    onEnter?: () => void
    onUpdate?: (dt: number) => void
    onExit?: () => void
}

// This line defines an optional property named onEnter within the IState interface. 
// The onEnter property is a function that takes no arguments and returns nothing(void).

let idCount = 0

// Variable idCount is declared and initialized with the value 0.
//  This variable is used to keep track of the number of StateMachine instances created.

export default class StateMachine {


    // Properties

    // The Map is a built-in JavaScript data structure that allows you to store key-value pairs.
    // In this case, the Map is parameterized with two types: string and IState.
    // This means that the keys in the map will be of type string, and the values will be of type IState.
    // So, the purpose of the states property is to store the different states of the state machine.
    // Each state is identified by a unique string key, and the corresponding value is an IState 

    private id = (++idCount).toString()
    private context?: object
    private states = new Map<string, IState>()

    private previousState?: IState
    private currentState?: IState
    private isChangingState = false
    private changeStateQueue: string[] = []

    get previousStateName() {
        if (!this.previousState) {
            return ''
        }

        return this.previousState.name
    }

    // Constructor
    constructor(context?: object, id?: string) {
        this.id = id ?? this.id
        this.context = context
    }

    // Methods
    isCurrentState(name: string) {
        if (!this.currentState) {
            return false
        }

        return this.currentState.name === name
    }

    addState(name: string, config?:
        {
            onEnter?: () => void,
            onUpdate?: (dt: number) => void,
            onExit?: () => void
        }) {
        const context = this.context

        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(context),
            onUpdate: config?.onUpdate?.bind(context),
            onExit: config?.onExit?.bind(context)
        })

        return this
    }

    setState(name: string) {
        if (!this.states.has(name)) {
            console.warn(`Tried to change to unknown state: ${name}`)
            return
        }

        if (this.isCurrentState(name)) {
            return
        }

        if (this.isChangingState) {
            this.changeStateQueue.push(name)
            return
        }

        this.isChangingState = true

        console.log(`[StateMachine (${this.id})] change from ${this.currentState?.name ?? 'none'} to ${name}`)

        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit()
        }

        this.previousState = this.currentState
        this.currentState = this.states.get(name)!

        if (this.currentState.onEnter) {
            this.currentState.onEnter()
        }

        this.isChangingState = false
    }

    update(dt: number) {
        if (this.changeStateQueue.length > 0) {
            this.setState(this.changeStateQueue.shift()!)
            return
        }

        if (this.currentState && this.currentState.onUpdate) {
            this.currentState.onUpdate(dt)
        }
    }
}