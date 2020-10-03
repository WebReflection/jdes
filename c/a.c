#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, const char* argv[]) {
  for (int i = 0; i < argc; i++)
    printf(i ? " %s" : "%s", argv[i]);
  return 0;
}
