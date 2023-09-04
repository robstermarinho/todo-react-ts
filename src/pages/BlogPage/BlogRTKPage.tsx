import { useState } from 'react'
import { Spinner } from 'phosphor-react'
import { useGetPostsQuery } from '../../redux/reducers/apiSlice'
import { Link } from 'react-router-dom'
import { Post } from '../../contexts/PostsContext'
import { BlogPageContainer } from './styles'
import InitLoading from '../../components/InitLoading'
import { formatDistanceToNow } from 'date-fns'

const PostExcerpt = ({ post }: { post: Post }) => {
  console.log(post)
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <span> {post.isPublished ? 'Published' : 'Draft'}</span>
      </div>
      <p className="post-content">{post.body.substring(0, 100)}</p>

      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
export function BlogRTKPage() {
  const [showPublished, setShowPublished] = useState(true)

  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery({
    isPublished: true,
  })

  let apiError: string | null = null

  if (!isLoading && !isSuccess && isError) {
    console.log(error)
    apiError = `${error.status} - Impossible to load posts now.`
  }

  const renderPosts = () => {
    if (!apiError && posts && posts.length === 0) {
      return <p>No posts found.</p>
    }

    return posts.map((post: Post) => (
      <div className="post" key={post.id}>
        <div className="postInfo">
          <div className="postInfoContent">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>

          <div className="dateInfo">
            <small>
              Created:{' '}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </small>

            <small>
              Updated:{' '}
              {formatDistanceToNow(new Date(post.updatedAt), {
                addSuffix: true,
              })}
            </small>
            {post.publishedAt && (
              <small>
                Published At:{' '}
                {formatDistanceToNow(new Date(post.publishedAt), {
                  addSuffix: true,
                })}
              </small>
            )}
          </div>
        </div>

        {!post.isPublished && (
          <div className="postActions">
            {/* <PostForm
              key={`update-form-${post.id}`}
              postData={post}
              buttonLabel="Update Post"
              btnIcon={<Pencil size={20} />}
            />
            <ConfirmDialog
              key={`publish-form-${post.id}`}
              onSuccess={() => handlePublishPost(post.id)}
              title="Publish Post"
              question="Are you sure you want to publish this post?"
              targetName={post.title}
              disabled={isUpdating}
              btnIcon={<ArrowBendUpRight size={20} />}
              buttonLabel={isUpdating ? 'Publishing...' : 'Publish'}
            /> */}
            {/* <ConfirmDialog
              key={`delete-form-${post.id}`}
              onSuccess={() => handleRemovePost(post.id)}
              title="Remove Post"
              question="Are you sure you want to remove this post?"
              targetName={post.title}
              disabled={isRemoving}
              buttonLabel={isRemoving ? 'Removing...' : 'Remove'}
            /> */}
          </div>
        )}
        {post.isPublished && (
          <div className="postActions">
            {/* <ConfirmDialog
              key={`unpublish-form-${post.id}`}
              onSuccess={() => handleUnpublishPost(post.id)}
              title="Unpublish Post"
              btnIcon={<ArrowBendLeftDown size={20} />}
              question="Are you sure you want to unpublish this post?"
              targetName={post.title}
              disabled={isUpdating}
              buttonLabel={isUpdating ? 'Unpublishing...' : 'Unpublish'}
            /> */}
          </div>
        )}
      </div>
    ))
  }

  return (
    <BlogPageContainer>
      <h1>Redux with RTK Query (apiSlice)</h1>
      <h2>{showPublished ? 'Blog Posts' : 'Draft Posts'}</h2>
      <div className="headerActions"></div>

      {apiError && <p>{apiError}</p>}
      {isLoading && <InitLoading />}
      <div className="postsList">{isSuccess && renderPosts()}</div>
    </BlogPageContainer>
  )
}
