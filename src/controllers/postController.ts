import { Request, Response } from 'express';
import Post from '../models/Post';
import { moderateContent } from '../utils/moderateContent';

// Create a Post
export const createPost = async (req: Request, res: Response) => {
    const { title, content, category, isPremium, isPublished, imageUrl } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // AI Moderation Check
        const moderationResult = await moderateContent(content);
        console.log('this is moderation content Result:', moderationResult);
         if (moderationResult.flagged) {
           return res.status(400).json({ message: `Updated content violates community guidelines: ${moderationResult.reason}` });
         }
    
        const post = new Post({
            title,
            content,
            category,
            isPremium,
            author: req.user._id,  
            imageUrl,
            isPublished,
            isFlagged: moderationResult.flagged,
            moderationReason: moderationResult.reason
            
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: 'Error creating post', error });
    }
};




export const updatePost = async (req: Request, res: Response) => {
    const {title, content, category, isPremium, isPublished, imageUrl} = req.body;
    try {
        if(!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({message: 'Post not found'});
        }
        if(post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: 'Forbidden: You can only update your own posts'});
        }

        // AI Moderation Check
        const isFlagged = await moderateContent(content);
        if(isFlagged) {
            return res.status(400).json({message: 'Updated content violates community guidelines.'})
        }

        const updatePost = await Post.findByIdAndUpdate(req.params.id, 
            {$set:{title, content, category, isPremium, isPublished, imageUrl}},
            {new: true, runValidators: true}
        );
        console.log("Received Update Request:", req.body);
        console.log("Updated Post in Backend:", updatePost?.content)
        res.json(updatePost);
    } catch (error) {
        res.status(400).json({message: 'Error updating post', error})
    }
}




// Get All Posts
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('author', 'name',);
        console.log('this is backend Posts:', posts)
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};



// Get Post by author Id
export const getPostsByAuthorId = async (req: Request, res: Response) => {
     const authorId = req.params.authorId;
     try {
        const posts = await Post.find({author: authorId}).populate('author', 'name'); // Filter posts by author ID

        if(!posts.length) {
            return res.status(404).json({message: "No posts found for this author"});
        }
        console.log("Posts by author:", posts);
        res.status(200).json(posts);
     } catch(error) {
        res.status(500).json({message:'Error fetching posts by author', error})
     }
 }


// Get Single Post
export const getPostById = async (req:Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message: 'Post not found'});
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: "Error retrieving post", error})
    }
}





// Upvote post
export const upvotePost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            post.upvotes = (post.upvotes || 0) + 1;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to upvote post', error });
    }
};

// Downvote post
export const downvotePost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            post.downvotes = (post.downvotes || 0) + 1;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to downvote post', error });
    }
};



// Delete a post
export const deletePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.id;
      const userId = req.user?.id; 
      const userRole = req.user?.role;

  
      const post = await Post.findById(postId);
  
      if(!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if(post.author.toString() !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this post' });
      }
  
      // Use deleteOne instead of remove
      await Post.deleteOne({ _id: post._id });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  };
  











