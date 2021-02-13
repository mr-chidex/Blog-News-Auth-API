# Blog Api, News Api, UserAuth

**_ CRUD OPERATIONS _**

1. Get blog and news post

```
GET /api/v1/blogs
GET /api/v1/news

```

2. Get blog and news post by category (e.g finance, medical, tech, etc)

```
GET /api/v1/blogs?category=skill
GET /api/v1/news?category=skill

```

3. Get single blog and news post. You can get number of views on a certain blog or news post

```
GET /api/v1/blogs/:blogId
GET /api/v1/news/:newsId

```

4. Blog & News post can be created.You must be an admin to create a post

```
POST /api/v1/blogs
POST /api/v1/news
```

5. Blog & News post can be updated. Post can oly be updated by its creator

```
PUT /api/v1/blogs/:blogId
PUT /api/v1/news/:newsId
```

6. Blog & News post can be updated. Post can oly be deleted by its creator

```
DELETE /api/v1/blogs/:blogId
DELETE /api/v1/news/:newsId
```

**_ Admin _**

1. signup

```
POST /api/v1/admin
```

2. Signin

```
POST /api/v1/admin/signin
```

- Github: [@mr-chidex](https://github.com/mr-chidex)
