export async function getPosts() {

    const posts = [
        {
            _uid: 1,
            slug: "my-first-post",
            title:"1st post"
        },
        {
            _uid: 2,
            slug: "my-second-post",
            title:"2nd post"
        },
        {
            _uid: 3,
            slug: "my-third-post",
            title:"3rd post"
        },
        {
            _uid: 4,
            slug: "my-fourth-post",
            title:"4th post"
        },
    ]

    return posts;
}