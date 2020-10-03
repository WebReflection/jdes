#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// great example of variable args but a bad idea
// at least for the console.log, just use printf
void console_log(int chunks, ...) {
  va_list arguments;
  va_start(arguments, chunks);
  for (int x = 0; x < chunks; x++) {
    printf(x ? " %s" : "%s", va_arg(arguments, char*));
  }
  va_end(arguments);
  printf("\n");
}

struct Book {
  char  *title;
  char  *author;
  char  *subject;
  int   id;       // assume {int: id = 0}
};

void printBook(struct Book book) {
  console_log(2, "test", "123");
  printf("Book title: %s\n", book.title);
  printf("Book author: %s\n", book.author);
  printf("Book id: %d\n", book.id);
}

// in main goes everything that runs in a global scope
// with modules this is a bit of an issue, find a way
// to export modules instead
int main() {

  struct Book b1;
  b1.title = (char *) malloc(0);
  b1.author = (char *) malloc(0);
  b1.author = (char *) realloc(b1.author, 18);
  b1.subject = (char *) malloc(0);
  strcpy(b1.author, "Andrea Giammarchi");
  b1.id = 0;

  struct Book b2;
  b2.title = (char *) malloc(0);
  b2.author = (char *) malloc(0);
  b2.subject = (char *) malloc(0);
  b2.id = 0;

  b1.title = (char *) realloc(b1.title, 14);
  strcpy(b1.title, "C Programming");
  b1.id = 6495407;

  b2.title = (char *) realloc(b2.title, 19);
  strcpy(b2.title, "Telecom Billing 💩");
  b2.id = 6495700;

  printBook(b1);
  printBook(b2);

  free(b1.title);
  free(b2.title);

  return 0;
}
