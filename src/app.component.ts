import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from './models/post.model';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  posts: Post[] = [];
  isLoading = false;
  error: string | null = null;
  newTitle = '';
  newContent = '';

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    console.log('coming in fetch post');
    this.isLoading = true;
    this.error = null;
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        console.log('coming in fetch result..', posts);
        this.isLoading = false;
        this.posts = posts;
        console.log('is loading...', this.isLoading);
      },
      error: (err) => {
        this.error = 'Failed to fetch posts. ' + err.message;
        this.isLoading = false;
      },
    });
  }

  onCreatePost(): void {
    if (!this.newTitle.trim() || !this.newContent.trim()) return;
    const post: Post = { title: this.newTitle, content: this.newContent };
    this.postsService.createPost(post).subscribe({
      next: () => {
        this.newTitle = '';
        this.newContent = '';
        this.fetchPosts();
      },
      error: (err) => {
        this.error = 'Failed to create post. ' + err.message;
      },
    });
  }

  trackById(index: number, post: Post) {
    return post.id;
  }

  onDeletePosts(): void {
    this.postsService.deletePosts().subscribe({
      next: () => {
        this.posts = [];
      },
      error: (err) => {
        this.error = 'Failed to delete posts. ' + err.message;
      },
    });
  }
}
