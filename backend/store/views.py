from rest_framework.views import APIView


class StopServerView(APIView):

    def get(self, request, *args, **kwargs):
        while True:
            print("Kill me")
