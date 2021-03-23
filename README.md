
# Express API

Simple Express API for authorization, generating rsa keys and encrypting.

## How to run for development

1.  Clone this repository.
2. Go to main directory.
```
cd express-api
```
3. Configure your .env file

5. Install dependencies
```
npm install
```

6. Run application with:
 ```
npm run start
 ```
By default the service will start on port  `3000`

### Now you can see this app in action!

1. Generate token.
```
curl --location -X POST 'localhost:3000/api/sign-in' \
-H'Content-Type: application/json' \
-d '{
    "email": "example@gmail.com",
    "password": "123"
}'
```
2. Copy the token to variable
```
token=yourToken
```
3. Get RSA public and private key based on your email:
```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${token}" localhost:3000/api/generate-key-pair
```
4. Get encrypted code of sample PDF
```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${token}" localhost:3000/api/encrypt
```
## How to run containerized app

1. Go to main directory.
2. Configure your .env file
3.  Build docker image:
```
docker-compose build
```

4. Run application with:
 ```
docker-compose up
 ```
By default the service will start on port  `3000`


## How to run tests

1. Go to main directory.
2.  Configure your .env file
3. Run unit tests with:
```
npm test
```

## Documentation
### Sign in
Returns jwt token if user's credentials are valid

| URL | Method | Data Params | Headers
| :--- | :--- | :--- | :--- | 
| `/api/sign-in` | `POST` | `{ email: string, password: string }` | `none`

-   **Success Response:**

    -   **Code:**  200 OK

        **Content:**

          ```json
        {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNjE2MzYwNjIwLCJleHAiOjE2MTYzNjA5MjB9.dNtdjJrbFt2fFi_okRay5_K-vMJccZNRN_vea_uyK68" 
        }
        ```
-   **Error Response:**

    -   **Code:**  400 BAD_REQUEST

        **Content:**
        ```json
        {
              "error": "missing required fields email and password"
        }
         ```

    -   **Code:**  401 UNAUTHORIZED

        **Content:**
        ```json
        {
              "error": "invalid email or password"
        }
        ```
    
### Get RSA public and private key
Returns rsa keys based on user's email

| URL | Method | Data Params | Headers
| :--- | :--- | :--- | :--- | 
| `/api/generate-key-pair` | `POST` | `{}` | `Authorization: Bearer <token>`

-   **Success Response:**

    -   **Code:**  200 OK

        **Content:**

         ```json
        {
              "privKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIJr...",
              "pubKey": "-----BEGIN PUBLIC KEY-----\nMIICIjANB34TSs..."
        }
        ```
-   **Error Response:**
    -   **Code:**  401 UNAUTHORIZED
    
        **Content:**  
         ```json
        {
              "error": "invalid token | jwt must be provided | jwt expired | ...", 
        }
        ```

### Get encrypted code of sample PDF
Returns Base64 code of sample PDF

| URL | Method | Data Params | Headers
| :--- | :--- | :--- | :--- | 
| `/api/encrypt` | `POST` | `{}` | `Authorization: Bearer <token>`

-   **Success Response:**

    -   **Code:**  200 OK

        **Content:**

         ```json
          cYYdhrjmCQf90drA7g6cf9vVV8aejaW+67TWSREvM2tgRPlWdzWnr/kPsmkKk15iEnTQB99oREqX1xw1lx/SpQ==
        ```
-   **Error Response:**
    -   **Code:**  401 UNAUTHORIZED

        **Content:**
         ```json
        {
              "error": "invalid token | jwt must be provided | jwt expired | ...", 
        }
        ```
## Things I would have done differently or better
- Create docker environment for development which autodetects changes in files
-  Add configuration for different .env files like .env.test or .env.local
- Write more tests which would cover negative responses
- Normally I use Nest.js as a backend framework but due to the type of task I decided to use express
- I know that I should have decoded the results in tests and check if the keys are correct with passphrase, but I'm not very familiar with encryption