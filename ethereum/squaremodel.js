import SquareJSON from './build/Square.json';

export default (address, myWeb3) => {
    return new myWeb3.eth.Contract(
        JSON.parse(SquareJSON.interface),
        address);
};  