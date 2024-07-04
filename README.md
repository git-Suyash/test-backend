# API Documentation

**Read this before proceeding futher in this document**

1. **It's the job of the Frontend/Fullstack/App Developer to suggest which field(s) should be added or removed from the request/response body.**
2. **Request Body and Response Body are examples.**
3. **All the fields of the login response(Response body in this documentation) must be saved in session storage as `userData`. Don't store error message(s).**
4. **Take `token` value from session storage. It will be stored as `userData.token`**
5. **Apply client side validations also.**

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
     <a href = "#Authentication-Routes">Authentication Routes</a>
    </li>
    <li>
     <a href = "#Admin-Routes">Admin Routes</a>
    </li>
    <li>
     <a href = "#Insights-Routes">Insights Routes</a>
    </li>
    <li>
       <a href="#User-Routes">User Routes</a>
    </li>
    <li>
       <a href="#Errors">Errors</a>
    </li>
  </ol>
</details>

## Authentication Routes

### /login

- Method: `POST`

- Request Body:

  ```json
  {
    "email": "test@jaipur.manipal.edu",
    "password": "1234567890"
  }
  ```

- Response Body:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdDIuY29tIiwidXNlcklkIjoiNjU5NWNhOTVhYzU5NjIzMGI1MDRjZjJmIiwiaWF0IjoxNzA0MzUyMTk2LCJleHAiOjE3MDQzOTUzOTZ9.8jL5zuU4EvTXjFtszmJCbfQ0NBIvJYQo2HBOAhQGWLQ",
    "approveRight": true,
    "userId": 4,
    "insightsView": true
  }
  ```

## Admin Routes

### /admin/users

- Method: `GET`

- Response Body:
  ```json
  {
    "users": [
      {
        "id": 2,
        "name": "test 2",
        "email": "test2@jaipur.manipal.edu",
        "department": "department 2",
        "school": "TAPMI School Of Business",
        "faculty": "faculty 2",
        "position": "Registrar",
        "phone": "8930110773",
        "isActive": true
      },
      {
        "id": 1,
        "name": "test 1",
        "email": "test1@jaipur.manipal.edu",
        "department": "department 1",
        "school": "TAPMI School Of Business",
        "faculty": "faculty 1",
        "position": "Registrar",
        "phone": "8930110773",
        "isActive": false
      }
    ]
  }
  ```

### /admin/login

- Method: `POST`

- Request Body:

  ```json
  {
    "email": "test@jaipur.manipal.edu",
    "password": "1234567890"
  }
  ```

- Response Body:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdDIuY29tIiwidXNlcklkIjoiNjU5NWNhOTVhYzU5NjIzMGI1MDRjZjJmIiwiaWF0IjoxNzA0MzUyMTk2LCJleHAiOjE3MDQzOTUzOTZ9.8jL5zuU4EvTXjFtszmJCbfQ0NBIvJYQo2HBOAhQGWLQ",
    "userId": 4,
    "admin": true
  }
  ```

### /all-notesheets

- Method : `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:

  ```json
  {
    "notesheets": [
      {
        "id": 48,
        "eventDate": "2024-04-30",
        "days": 2,
        "faculty": "Faculty of Engineering",
        "school": "School Of Computer Science & Engineering",
        "department": "Department of Computer Science & Engineering",
        "subject": "Oneiros",
        "details": "N/A",
        "objectives": "To destroy peoples lives",
        "proposers": ["DEAN 1", "Mr. D"],
        "status": "Pending",
        "edit": false,
        "finance": null,
        "createdAt": "2024-04-16T09:24:24.443Z",
        "updatedAt": "2024-04-16T09:24:24.443Z"
      },
      {
        "id": 52,
        "eventDate": "2024-04-19",
        "days": 12,
        "faculty": "Faculty of Engineering",
        "school": "School Of Computer Science & Engineering",
        "department": "Department of Computer Science & Engineering",
        "subject": "13123",
        "details": "adada",
        "objectives": "123123",
        "proposers": ["Abraham (HOD)\nCSE"],
        "status": "Pending",
        "edit": false,
        "finance": "123123",
        "createdAt": "2024-04-16T19:46:53.976Z",
        "updatedAt": "2024-04-16T19:46:53.976Z"
      }
    ]
  }
  ```

### /add-new-user

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "email": "test@jaipur.manipal.edu",
    "approveRight": true,
    "name": "test4",
    "phone": "1234567890",
    "position": "student",
    "school": "SCSE",
    "department": "CSE",
    "faculty": "Faculty"
  }
  ```

- Response Body:
  ```json
  {
    "message": "User Created!"
  }
  ```

### /update-user

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "userId": "userId of the user whose details has to be updated.",
    "email": "test@jaipur.manipal.edu",
    "approveRight": true,
    "name": "test4",
    "phone": "1234567890",
    "position": "student",
    "school": "SCSE",
    "department": "CSE",
    "faculty": "Faculty"
  }
  ```

- Response Body:
  ```json
  {
    "message": "User Updated!"
  }
  ```

### /activate-user

- Method: `POST`

- Request Header: `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "userId": "userId of the user which has to be activated/deactivated.",
    "active": "`true` to activate, `false` to deactivate"
  }
  ```

- Response Body:
  ```json
  {
    "message": "[Teacher Name] Activated/Deactivated."
  }
  ```

## Insights Routes

### /stats

- Method: `POST`

- Request Header: `Authorization:Bearer <token>`

- Response will be according to the position of user

- Response Body(`Head of Department` and `Deputy Head of Department`):

  ```json
  {
    "Stats": [
      {
        "Department of Computer Science & Engineering": [
          {
            "status": "Approved",
            "count": "1",
            "sum": null
          },
          {
            "status": "Pending",
            "count": "6",
            "sum": "123247"
          },
          {
            "status": "Rejected",
            "count": "2",
            "sum": null
          },
          {
            "status": "Reverted",
            "count": "1",
            "sum": null
          }
        ]
      }
    ]
  }
  ```

- Response Body(`Director`):

  ```json
  {
    "Stats": [
      {
        "School Of Computer Science & Engineering": [
          {
            "Department of Artificial Intelligence & Machine Learning": [
              {
                "status": "Pending",
                "count": "1",
                "sum": null
              }
            ]
          },
          {
            "Department of Computer Science & Engineering": [
              {
                "status": "Approved",
                "count": "1",
                "sum": null
              },
              {
                "status": "Pending",
                "count": "6",
                "sum": "123247"
              },
              {
                "status": "Rejected",
                "count": "2",
                "sum": null
              },
              {
                "status": "Reverted",
                "count": "1",
                "sum": null
              }
            ]
          }
        ]
      }
    ]
  }
  ```

- Response Body(`Dean`)

  ```json
  {
    "Stats": [
      {
        "Faculty of Engineering": [
          {
            "School Of Computer Science & Engineering": [
              {
                "Department of Artificial Intelligence & Machine Learning": [
                  {
                    "status": "Pending",
                    "count": "1",
                    "sum": null
                  }
                ]
              },
              {
                "Department of Computer Science & Engineering": [
                  {
                    "status": "Approved",
                    "count": "1",
                    "sum": null
                  },
                  {
                    "status": "Pending",
                    "count": "6",
                    "sum": "123247"
                  },
                  {
                    "status": "Rejected",
                    "count": "2",
                    "sum": null
                  },
                  {
                    "status": "Reverted",
                    "count": "1",
                    "sum": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  ```

- Response Body(`Registrar`, `Pro President`, `President`)
  ```json
  {
    "Stats": [
      {
        "Faculty of Engineering": [
          {
            "School Of Computer Science & Engineering": [
              {
                "Department of Computer Science & Engineering": [
                  {
                    "status": "Pending",
                    "count": "6",
                    "sum": "123247"
                  },
                  {
                    "status": "Rejected",
                    "count": "2",
                    "sum": null
                  },
                  {
                    "status": "Approved",
                    "count": "1",
                    "sum": null
                  },
                  {
                    "status": "Reverted",
                    "count": "1",
                    "sum": null
                  }
                ]
              },
              {
                "Department of Artificial Intelligence & Machine Learning": [
                  {
                    "status": "Pending",
                    "count": "1",
                    "sum": null
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Faculty of Design": [
          {
            "School of Design & Art": [
              {
                "Department of Fine Arts": [
                  {
                    "status": "Rejected",
                    "count": "1",
                    "sum": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  ```

## User Routes

### /change-password

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "currentPassword": "test@jaipur.manipal.edu",
    "newPassword": "1234567890"
  }
  ```

- Response Body:
  ```json
  {
    "message": "Password changed successfully!"
  }
  ```

### /user-details

- Method: `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:
  ```json
  {
    "user": {
      "id": 1,
      "name": "test 1",
      "position": "position 1",
      "faculty": "faculty 1",
      "school": "school 1",
      "department": "department 1",
      "phone": "1234567891",
      "email": "test1@jaipur.manipal.edu"
    }
  }
  ```

### /user-notifications

- Method: `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:
  ```json
  {
    "notifications": [
      "This is a test remark!!!",
      "This is also a test remark!!!"
    ]
  }
  ```

### /notesheets-for-approval

- Method: `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:
  ```json
  {
    "notesheets": [
      {
        "status": "Approved\n",
        "rank": 0,
        "userId": 1,
        "notesheetId": 3,
        "eventDate": "2024-04-20",
        "subject": "test",
        "details": "test",
        "objectives": "test",
        "proposers": ["test1, test2"],
        "name": "test1",
        "email": "test1@jaipur.manipal.edu",
        "phone": "1234567891"
      },
      {
        "status": "Approved",
        "rank": 0,
        "userId": 1,
        "notesheetId": 5,
        "eventDate": "2024-04-20",
        "subject": "test 1",
        "details": "test 1",
        "objectives": "test 1",
        "proposers": ["test1", "test2"],
        "name": "test1",
        "email": "test1@jaipur.manipal.edu",
        "phone": "1234567891"
      }
    ]
  }
  ```
  - There are 4 statuses for a notesheet: "Approved", "Pending", "Rejected" or "Reverted".

### /my-notesheets

- Method: `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:
  ```json
  {
    "notesheets": [
      {
        "id": 1,
        "eventDate": "2024-05-20",
        "subject": "subject 1",
        "details": "details 1",
        "proposers": ["proposer 1", "proposer 2"],
        "status": "Pending",
        "createdAt": "2024-04-11T15:05:22.046Z"
      },
      {
        "id": 2,
        "eventDate": "2024-05-21",
        "subject": "subject 2",
        "details": "details 2",
        "proposers": ["proposer 2", "proposer 2"],
        "status": "Pending",
        "createdAt": "2024-04-11T15:05:59.937Z"
      }
    ]
  }
  ```
  - There are 4 statuses for a notesheet: "Approved", "Pending", "Rejected" or "Reverted".

### /viewer-notesheets

- Method: `GET`

- Request Header:
  `Authorization:Bearer <token>`

- Response Body:
  ```json
  {
    "notesheets": [
      {
        "id": 1,
        "eventDate": "2024-05-20",
        "subject": "subject 1",
        "details": "details 1",
        "proposers": ["proposer 1", "proposer 2"],
        "status": "Pending",
        "createdAt": "2024-04-11T15:05:22.046Z"
      },
      {
        "id": 2,
        "eventDate": "2024-05-21",
        "subject": "subject 2",
        "details": "details 2",
        "proposers": ["proposer 2", "proposer 2"],
        "status": "Pending",
        "createdAt": "2024-04-11T15:05:59.937Z"
      }
    ]
  }
  ```
  - There are 4 statuses for a notesheet: "Approved", "Pending", "Rejected" or "Reverted".

### /users

- Method: `GET`

- Response Body:
  ```json
  {
    "users": [
      {
        "id": 2,
        "name": "test 2",
        "email": "test2@jaipur.manipal.edu",
        "department": "department 2",
        "school": "TAPMI School Of Business",
        "faculty": "faculty 2",
        "position": "Registrar",
        "phone": "8930110773",
        "isActive": true
      },
      {
        "id": 1,
        "name": "test 1",
        "email": "test1@jaipur.manipal.edu",
        "department": "department 1",
        "school": "TAPMI School Of Business",
        "faculty": "faculty 1",
        "position": "Registrar",
        "phone": "8930110773",
        "isActive": true
      }
    ]
  }
  ```

### /approvers

- Method: `GET`

- Response Body:

  ```json
  {
    "approvers": [
      {
        "id": 5,
        "name": "test 5",
        "email": "test5@jaipur.manipal.edu",
        "department": "department 5",
        "faculty": "faculty 5",
        "position": "Position 1"
      },
      {
        "id": 3,
        "name": "test 3",
        "email": "test3@jaipur.manipal.edu",
        "department": "department 3",
        "faculty": "faculty 3",
        "position": "Position 1"
      }
    ]
  }
  ```

### /faculty-list

- Method: `GET`

- Response Body:

  ```json
  {
    "faculty": {
      "Faculty of Engineering": {
        "School Of Computer Science & Engineering": [
          "Department of Computer Science & Engineering",
          "Department of Artificial Intelligence & Machine Learning"
        ],
        "School Of Computing & Intelligent Systems": [
          "Department of Computer & Communication Engineering",
          "Department of IoT & Intelligent Systems"
        ],
        "School of Information, Security and Data Science": [
          "Department of Information Technology",
          "Department of Data Science & Engineering"
        ],
        "School of Automobile, Mechanical and Mechatronics": [
          "Department of Mechanical Engineering",
          "Department of Mechatronics Engineering"
        ],
        "School of Electrical, Electronics & Communication Engineering": [
          "Department of Electrical Engineering",
          "Department of Electronics & Communication Engineering"
        ],
        "School of Civil, Biotechnology and Chemical Engineering": [
          "Department of Civil Engineering",
          "Department of Biotechnology and Chemical Engineering"
        ]
      },
      "Faculty of Design": {
        "School of Design & Art": [
          "Department of Fine Arts",
          "Department of Fashion Design",
          "Department of Interior Design",
          "Department of Interaction and Communication Design (ICD)"
        ],
        "School of Architecture & Design": ["Department of Architecture"]
      }
    }
  }
  ```

### /position-list

- Method: `GET`

- Response Body:
  ```json
  {
    "Positions": [
      "President",
      "Pro President",
      "Registrar",
      "Dean",
      "Director",
      "Head of Department",
      "Deputy Head of Department",
      "Associate Professor",
      "Assistant Professor",
      "Associate Professor (Adhoc)",
      "Assistant Professor (Adhoc)",
      "Associate Professor (Selection grade)",
      "Assistant Professor (Selection grade)",
      "Associate Professor (Senior Scale)",
      "Assistant Professor (Senior Scale)"
    ]
  }
  ```

### /new-notesheet

- In teachers field put userId of teachers.
- **eventDate must be in `YYYY-MM-DD` format.**

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- To upload pdf files, the field name should be `fields`. At max, 10 pdf files can be uploaded.

- Request Body:

  ```json
  {
    "eventDate": "2024-05-23",
    "days": 5,
    "school": "school-3",
    "department": "department-3",
    "subject": "subject 3",
    "details": "details 3",
    "objectives": "objectives 3",
    "proposers": ["proposer 1", "proposer 2"],
    "faculty": "faculty 3",
    "teachers": [4, 5, 6],
    "finance": "amount or null"
  }
  ```

- Response Body:
  ```json
  {
    "message": "Notesheet Created!"
  }
  ```

### /update-notesheet

- **In teachers field put userId of teachers.**
- **eventDate must be in `YYYY-MM-DD` format.**

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- To upload pdf files, the field name should be `fields`. At max, 10 pdf files can be uploaded.

- Request Body:

  ```json
  {
    "notesheetId": 3,
    "eventDate": "2024-05-23",
    "days": 5,
    "school": "school 3",
    "department": "department 3",
    "subject": "subject 3",
    "details": "details 3",
    "objectives": "objectives 3",
    "proposers": ["proposer 1", "proposer 2"],
    "faculty": "faculty 3",
    "teachers": [3, 4, 6],
    "finance": "amount or null"
  }
  ```

- Response Body:

  ```json
  {
    "message": "Notesheet updated"
  }
  ```

### /notesheet-details

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 3
  }
  ```

- Response Body:

  ```json
  {
    "notesheet": {
      "notesheetId": 3,
      "eventDate": "2024-05-23",
      "faculty": "faculty 3",
      "school": "school 3",
      "department": "department 3",
      "subject": "subject 3",
      "details": "details 3",
      "objectives": "objectives 3",
      "proposers": ["proposer 1", "proposer 2"],
      "status": "Pending",
      "createdAt": "2024-04-11T15:10:05.940Z",
      "edit": false,
      "users": [
        {
          "userId": 1,
          "userName": "test 1",
          "userEmail": "test1@jaipur.manipal.edu",
          "userPhone": "1234567891",
          "userPosition": "position 1",
          "userRank": 0,
          "userStatus": "Approved",
          "userStatusUpdatedAt": "2024-04-11T15:22:33.963Z"
        },
        {
          "userId": 3,
          "userName": "test 3",
          "userEmail": "test3@jaipur.manipal.edu",
          "userPhone": "1234567893",
          "userPosition": "position 3",
          "userRank": 1,
          "userStatus": "Introduced",
          "userStatusUpdatedAt": "2024-04-11T15:22:33.967Z"
        },
        {
          "userId": 4,
          "userName": "test 4",
          "userEmail": "test4@jaipur.manipal.edu",
          "userPhone": "1234567894",
          "userPosition": "position 4",
          "userRank": 2,
          "userStatus": "Pending",
          "userStatusUpdatedAt": "2024-04-11T15:22:33.954Z"
        },
        {
          "userId": 6,
          "userName": "test 6",
          "userEmail": "test6@jaipur.manipal.edu",
          "userPhone": "1234567896",
          "userPosition": "position 6",
          "userRank": 3,
          "userStatus": "Pending",
          "userStatusUpdatedAt": "2024-04-11T15:22:33.958Z"
        }
      ],
      "remarks": [
        {
          "userId": 1,
          "userName": "test 1",
          "remark": "Remark 1",
          "createdAt": "2024-04-14T19:41:15.842Z"
        },
        {
          "userId": 1,
          "userName": "test 1",
          "remark": "Remark 1",
          "createdAt": "2024-04-14T19:41:15.842Z"
        }
      ]
    }
  }
  ```

  - There are 5 statuses for a user: "Approved", "Pending", "Introduced", "Action Required", "Rejected" or "Reverted".
  - There are 4 statuses for a notesheet: "Approved", "Pending", "Rejected" or "Reverted".

### /approve-notesheet

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 2
  }
  ```

- Response Body:
  ```json
  {
    "message": "Notesheet approved"
  }
  ```

### /new-remark

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 3,
    "remark": "This is also a test remark!!!"
  }
  ```

- Response Body:
  ```json
  {
    "message": "Remark added"
  }
  ```

### /revert-notesheet

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 3,
    "toUserId": 2
  }
  ```

- Response Body:
  ```json
  {
    "message": "Notesheet reverted"
  }
  ```

### /reject-notesheet

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 3
  }
  ```

- Response Body:
  ```json
  {
    "message": "Notesheet rejected"
  }
  ```

### /send-message

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "receiverId": 1,
    "message": "Message 4",
    "notesheetId": 3
  }
  ```

- Response Body:
  ```json
  {
    "message": "Message Sent"
  }
  ```

### /private-remarks

- Method: `POST`

- Request Header:
  `Authorization:Bearer <token>`

- Request Body:

  ```json
  {
    "notesheetId": 3
  }
  ```

- Response Body:
  ```json
  {
    "privateRemarks": [
      {
        "privateRemark": "Private Message 1",
        "createdAt": "2024-04-16T08:23:47.727Z",
        "senderName": "HOD 1",
        "receiverName": "Mr. B"
      },
      {
        "privateRemark": "Private Message 2",
        "createdAt": "2024-04-16T08:40:45.747Z",
        "senderName": "HOD 1",
        "receiverName": "Mr. B"
      }
    ]
  }
  ```

## Errors

- **Response Body is an example**

- Response Body:
  ```json
  {
    "message": "Validation Failed!",
    "data": [
      {
        "type": "field",
        "value": "test@test4.com",
        "msg": "Email already exists!",
        "path": "email",
        "location": "body"
      },
      {
        "type": "field",
        "value": "123456780",
        "msg": "Password must be at least 10 characters long.",
        "path": "password",
        "location": "body"
      },
      {
        "type": "field",
        "value": "",
        "msg": "Name cannot be empty.",
        "path": "name",
        "location": "body"
      }
    ]
  }
  ```
