// Import Webit3.js library
const Web3 = require('web3');

// Set up Web3 provider
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Set contract address and ABI
const contractAddress = '0x3e386D500327dA7ab777974A1Cb83Da4B4315B0B'; // Replace with your contract address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_author",
				"type": "string"
			}
		],
		"name": "addBook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "author",
				"type": "string"
			}
		],
		"name": "BookAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			}
		],
		"name": "BookBorrowed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			}
		],
		"name": "BookReturned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "borrowBook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "returnBook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "books",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "author",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "borrowedBooks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Replace with your contract ABI

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get user's account
let userAccount;

web3.eth.getAccounts().then(accounts => {
    userAccount = accounts[0];
    console.log('User account:', userAccount);
});

// Add book form submission handler
document.getElementById('add-book-form').addEventListener('submit', async event => {
    event.preventDefault();

    const bookId = document.getElementById('book-id').value;
    const bookTitle = document.getElementById('book-title').value;
    const bookAuthor = document.getElementById('book-author').value;

    try {
        await contract.methods.addBook(bookId, bookTitle, bookAuthor).send({ from: userAccount });
        console.log('Book added successfully!');
        document.getElementById('add-book-form').reset();
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

// Borrow book form submission handler
document.getElementById('borrow-book-form').addEventListener('submit', async event => {
    event.preventDefault();

    const bookId = document.getElementById('book-id-borrow').value;

    try {
        await contract.methods.borrowBook(bookId).send({ from: userAccount });
        console.log('Book borrowed successfully!');
        document.getElementById('borrow-book-form').reset();
    } catch (error) {
        console.error('Error borrowing book:', error);
    }
});

// Return book form submission handler
document.getElementById('return-book-form').addEventListener('submit', async event => {
    event.preventDefault();

    const bookId = document.getElementById('book-id-return').value;

    try {
        await contract.methods.returnBook(bookId).send({ from: userAccount });
        console.log('Book returned successfully!');
        document.getElementById('return-book-form').reset();
    } catch (error) {
        console.error('Error returning book:', error);
    }
});

// Load book list
contract.methods.getBookList().call().then(bookList => {
    const bookListHtml = bookList.map(book => {
        return `
            <li>
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>ID: ${book.id}</p>
                <p>Availability: ${book.isAvailable ? 'Available' : 'Not Available'}</p>
            </li>
        `;
    }).join('');

    document.getElementById('book-list-ul').innerHTML = bookListHtml;
});