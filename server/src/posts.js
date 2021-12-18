const express = require('express');

const router = express.Router();

const User = require('./user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const JWT_SECRET = 'feioafioae;ifKAeifo83u714ikpo0[eq9pdfenkl,bhanjmkl;/duioy'

const Web3 = require('web3');

const web3Provider = new Web3('https://mainnet.infura.io/v3/83782f0d2c51432d91dad838e29f9b28');

const Tx = require('ethereumjs-tx').Transaction;

const axios = require('axios').default;


router.post('/api/signup', async ( req, res ) => {

      const { username, password: plainTextPassword } = req.body

      const user = await User.findOne({ username }).lean()
      if(user) {
            return res.json({ status: 'error', error: 'Username already exists'})
      }

      if(!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username'})
      }
     
      if(!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid Password'})
      }

      if(plainTextPassword.length < 6) {
            return res.json({ status: 'error', error: 'Password too short. Minimum 7 characters'})
      }

      // Hashing the password
      const password = await bcrypt.hash(plainTextPassword, 10)

      const account = web3Provider.eth.accounts.create();

      const response = await User({
            username,
            password,
            address: account.address,
            privateKey: account.privateKey,
            tokenContracts: [
              "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            ]
      })

      try {
        const savedPost = await response.save();
      } catch (err) {
        console.log(err)
        if(err.code === 11000) {
            return res.json({ status: 'error', error: 'Username already exists'})
        } else {
            return res.json({status: 'error', error: 'There was an error'})
        }
        throw err;
      }

      res.json({ status: 'ok' })
});

router.post('/api/login', async ( req, res ) => {

      const { username, password } = req.body

      const user = await User.findOne({ username }).lean()
      if(!user) {
            return res.json({ status: 'error', error: 'Invalid username/password'})
      }

      if(await bcrypt.compare(password, user.password)) {
            // the email & password pair is correct

            const token = jwt.sign({ 
                  id: user._id, 
                  username: user.username 
            }, JWT_SECRET)

            return res.json({ status: 'ok', data: token})
      }
      
      res.json({ status: 'error', error: 'Invalid password'})
});

router.post('/api/profile', async ( req, res ) => {
      
      const { token } = req.body

      try{
            const user = jwt.verify(token, JWT_SECRET)
            const username = user.username;

            const profile = await User.findOne({ username }, {username: 1, address: 1, _id: 0}).lean()
            res.json({ status: 'ok', data: {profile}})

        } catch(error) {
            res.json({status: 'error', error: 'Please login'})
      }
});

router.post('/api/importToken', async ( req, res ) => {
      
      const { token, address } = req.body

      try{
            const user = jwt.verify(token, JWT_SECRET)
            const username = user.username;

            const profile = await User.findOne({ username }, {username: 1, tokenContracts: 1, _id: 0}).lean()
            var tokenContracts = profile.tokenContracts
            tokenContracts.push(address)
            await User.updateOne(
                  { username },
                  { 
                        $set: { tokenContracts }
                  }
            )

            res.json({ status: 'ok' })

        } catch(error) {
            res.json({status: 'error', error: 'Please login'})
      }
});

router.post('/api/ethBalance', async ( req, res ) => {
      
    const { token } = req.body

    try{
          const user = jwt.verify(token, JWT_SECRET)
          const username = user.username;

          const profile = await User.findOne({ username }, { address: 1, _id: 0}).lean()
          const balance = await web3Provider.eth.getBalance(profile.address)
          res.json({ status: 'ok', data: { balance }})

      } catch(error) {
          res.json({status: 'error', error: 'Please login'})
    }
});

router.post('/api/allBalances', async ( req, res ) => {
      
    const { token } = req.body

    try{
          const user = jwt.verify(token, JWT_SECRET)
          const username = user.username;
          const profile = await User.findOne({ username }, { address: 1, tokenContracts: 1, _id: 0}).lean()
          const tokens = profile.tokenContracts
          var parsedTokens = [];
          for(var i = 0; i < tokens.length; i++) {
            const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${tokens[i]}&apikey=7F9FANI79KMS5W817Z41IXA12NIT1UWPKE`)
            const contract = new web3Provider.eth.Contract(JSON.parse(response.data.result), tokens[i])
            const balance = await contract.methods.balanceOf(profile.address).call();
            const symbol = await contract.methods.symbol().call();
            parsedTokens.push({balance, symbol, address: tokens[i]})
          }

          res.json({ status: 'ok', tokens: parsedTokens})

      } catch(error) {
          console.log(error)
          res.json({status: 'error', error: error})
    }
});

// router.post('/api/transaction', async ( req, res ) => {
      
//       const { token, receiver, amount, contractAddress } = req.body

//       try{
//             const user = jwt.verify(token, JWT_SECRET)
//             const username = user.username;

//             const data = await User.findOne({ username }).lean()

//             const contract = new web3Provider.eth.contract(abi, contractAddress)
//             const pubKey = data.address
//             var gasLimit = 3000000;
        
//             // Get User's Number of Transactions
//             var count = await web3Provider.eth.getTransactionCount(pubKey);
//             const numberOfTransactions = `Number transactions so far: ${count}`
        
//             var chainId = 1; // Chain ID for OBS Mainnet
//             // Formulate the Transaction
//             var rawTransaction = {
//                 "from": pubKey,
//                 "nonce": "0x" + count.toString(16),
//                 "gasPrice": web3Provider.utils.toHex(gasPriceGwei * 1e9),
//                 "gasLimit": web3Provider.utils.toHex(gasLimit),
//                 "to": contractAddress,
//                 "value": "0x0",
//                 "data": contract.methods.transfer(receiver, amount).encodeABI(),
//                 "chainId": chainId
//             };
        
//             // Log the transaction's data
//             const transactionRaw = `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`
        
//             // Get the User's private key to sign the transaction
//             const privkey1 = data.privateKey.replace("0x", "")
//             const privKey = new Buffer.from(privkey1, 'hex');
//             var tx = new Tx(rawTransaction, { common: obsCommon });
//             tx.sign(privKey);
//             var serializedTx = tx.serialize();
            
//             const signedTx = `Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`
        
//             // Print the transaction's receipt
//             var receipt = await web3Provider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
//             const receiptInfo = `Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`

//             res.json({ status: 'ok', data: {numberOfTransactions, transactionRaw, signedTx, receiptInfo} })
//       } catch(error) {
//             res.json({status: 'error', error: 'Invalid receiver.'})
//       }       
// });


module.exports = router;