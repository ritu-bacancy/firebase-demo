import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private firebaseUrl =
    'https://fresher-training-d9768-default-rtdb.asia-southeast1.firebasedatabase.app/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(`${this.firebaseUrl}.json`)
      .pipe(
        map((responseData) => {
          if (!responseData) return [];
          return Object.keys(responseData).map((key) => ({
            id: key,
            ...responseData[key],
          }));
        })
      );
  }

  createPost(post: Post): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.firebaseUrl}.json`, post);
  }

  deletePosts(): Observable<null> {
    return this.http.delete<null>(`${this.firebaseUrl}.json`);
  }
}
