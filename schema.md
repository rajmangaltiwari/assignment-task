# Schema Documentation: Me-API Playground

## Database: MongoDB

**DB Name**: `me_api_playground`

## Collections

### profiles

Stores the candidate's personal and professional information.

| Field       | Type     | Description                                |
| :---------- | :------- | :----------------------------------------- |
| `name`      | String   | Candidate's full name (Primary Identifier) |
| `email`     | String   | Unique contact email                       |
| `education` | String   | Degree/University information              |
| `skills`    | [String] | List of technical skills                   |
| `projects`  | [Object] | Array of project objects                   |
| `work`      | [Object] | Array of work experience objects           |
| `links`     | Object   | Social and portfolio URLs                  |

#### Project Object Structure

- `title`: String
- `description`: String
- `links`: { `github`: String, `demo`: String }

#### Work Object Structure

- `company`: String
- `position`: String
- `duration`: String
- `description`: String

## Indexes

- `email`: Unique index to prevent duplicate profiles.
- `createdAt`/`updatedAt`: Automatic timestamp indexes.
