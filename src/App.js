import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css'

export const ACTIONS = {
    ADD_DIGIT: "add-digit",
    CHOOSE_OPERATION: "choose-operation",
    CLEAR: "clear",
    DELETE_DIGIT: "delete-digit",
    EVALUATE: "evaluate",
}

const reducer = (state, {type, payload}) => {
    switch(type){
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite){
                return{
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false 
                }
            }
            if(payload.digit==="0" && state.currentOperand === "0"){
                return state;
            }
            if(payload.digit=== "." && state.currentOperand.includes(".")){
                return state;
            }
            return{
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }
        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand === "" && state.previousOperand === "" ){
                return{
                    ...state,
                    currentOperand:"",
                    previousOperand: "",
                    operation:"",
                }
            }
            if(state.currentOperand === ""){
                return{
                    ...state,
                    operation: payload.operation
                }
            }
            if(state.previousOperand === ""){
                return{
                    ...state,
                    previousOperand: state.currentOperand,
                    currentOperand:"",
                    operation: payload.operation,
                }
            }
            return{
                ...state,
                previousOperand: evaluate(state),
                currentOperand: "",
                operation: payload.operation
            }
        case ACTIONS.CLEAR:
            return{
                ...state,
                currentOperand:"",
                previousOperand: "",
                operation:"",
            }
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite){
                return{
                    ...state,
                    currentOperand:"",
                    previousOperand: "",
                    operation:"",
                    overwrite: false
                }
            }
            if(state.currentOperand === ""){
                return state;
            }
            if(state.currentOperand.length === 1){
                return{
                    ...state,
                    currentOperand:"",
                    previousOperand: "",
                    operation:"",
                }
            }
            
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0,-1)
            }
        case ACTIONS.EVALUATE:
            if(state.currentOperand === "" || state.previousOperand === "" || state.operation === ""){
                return state;
            }
            return{
                ...state,
                overwrite: true,
                previousOperand: '',
                currentOperand: evaluate(state),
                operation:""
            }
        default:
            return null;
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = "";
    var strNum1 = prev + '';
    var strNum2 = current + '';
    var dpNum1 = !!(prev % 1) ? (strNum1.length - strNum1.indexOf('.') - 1) : 0;
    var dpNum2 = !!(current % 1) ? (strNum2.length - strNum2.indexOf('.') - 1) : 0;
    var multiplier = Math.pow(10, dpNum1 > dpNum2 ? dpNum1 : dpNum2);
    var tempNum1 = Math.round(prev * multiplier);
    var tempNum2 = Math.round(current * multiplier);
    switch (operation) {
      case "+":
        computation = (tempNum1 + tempNum2)/multiplier
        break
      case "-":
        computation = (tempNum1 - tempNum2) / multiplier;
        break
      case "*":
        computation = (tempNum1 * tempNum2) / (multiplier * multiplier);
        break
      case "÷":
        computation = (tempNum1 / tempNum2);
        break
      default: 
        computation = ""
    }
  
    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

const formatOperand =  (operand) => {
    if(operand === "") return;
    const [integer, decimal] = operand.split('.')
    if(decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
  
const App = () => {
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {currentOperand:"", previousOperand: "",operation:""});
    return ( 
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
                <div className="current-operand">{formatOperand(currentOperand)}</div>
            </div> 
            <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
            <OperationButton operation="÷" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className="span-two " onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>


        </div>
     );
}
 
export default App;