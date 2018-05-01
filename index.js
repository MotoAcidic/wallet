
const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"message","type":"string"},{"name":"recipients","type":"address[]"}],"name":"airdrop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DROP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"RESERVE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CAP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]')
const decimals = 18
const tokenSymbol = 'AVO'
contractInstance = web3.eth.contract(abi).at('0xfa6f7881E52fDF912c4a285D78a3141B089cE859');

function displayProviderInfo() {
    document.getElementById("main").innerHTML = 'No compatible wallet provider found. Please install <a target="_blank" href="https://metamask.io/">Metamask</a>.';
}

function startApp() {
    document.getElementById("tokenSymbol").innerHTML = tokenSymbol;
    var account = '';
    var accountInterval = setInterval(function() {
        if (typeof web3.eth.accounts[0] == 'undefined') {
            account = '';
            document.getElementById("address").innerHTML = '';
            document.getElementById("ethBalance").innerHTML = '';
            document.getElementById("tokenBalance").innerHTML = '';
            document.getElementById("transferResult").innerHTML = '';
        } else if (web3.eth.accounts[0] !== account) {
            account = web3.eth.accounts[0];
            document.getElementById("address").innerHTML = account;

            web3.eth.getBalance(account, function (error, result) {
                if (error) {
                    document.getElementById("ethBalance").innerHTML = 'getBalance error: ${err}';
                } else {
                    document.getElementById("ethBalance").innerHTML = web3.fromWei(result);
                }
            });

            contractInstance.balanceOf.call(account, function (error, result) {
                if (error) {
                    document.getElementById("tokenBalance").innerHTML = 'balanceOf error: ${err}';
                } else {
                    document.getElementById("tokenBalance").innerHTML = (result * 10**-decimals) + ' ' + tokenSymbol;
                }
            });
        }
    }, 100);  
}

function transferTokens() {
    document.getElementById("transferResult").innerHTML = '';
    
    var transferValue = document.getElementById("transferValue").value;
    var regex = /[0-9]|\./;
    if(!isNumeric(transferValue)) {
        document.getElementById("transferResult").innerHTML = 'Invalid transfer value';
        return;
    }

    var recipientAddress = document.getElementById("recipientAddress").value;
    if (!recipientAddress || !isAddress(recipientAddress)) {
        document.getElementById("transferResult").innerHTML = 'Invalid ethereum address';
        return;        
    }

    transferValue = transferValue * 10**decimals;
    contractInstance.transfer(recipientAddress, transferValue, function (error, result) {
        if (error) {
            document.getElementById("transferResult").innerHTML = error;
        } else {
            document.getElementById("transferResult").innerHTML = '<a target="_blank" href="https://etherscan.io/tx/' + result + '">Click to view transaction on etherscan.io</a>';
        }
    });
}

function isNumeric(value) {
    var regex = /[0-9]|\./;
    return regex.test(value);
}

function isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return true;
    } else {
        return isChecksumAddress(address);
    }
};

function isChecksumAddress(address) {
    address = address.replace('0x','');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};