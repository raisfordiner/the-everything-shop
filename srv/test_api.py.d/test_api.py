#!/usr/bin/env python3

import json
import requests
import time
import sys

class APITester:
    def __init__(self, config_file='config.json', test_file='tests.json'):
        with open(config_file) as f:
            self.config = json.load(f)

        with open(test_file) as f:
            self.tests = json.load(f)

        self.session = requests.Session()
        self.base_url = self.config['base_url']



    def wait_for_health_check(self):
        print("Waiting for API to be ready...")
        health_url = self.base_url + self.config['health_check_endpoint']
        timeout = self.config['timeout']
        start_time = time.time()

        while time.time() - start_time < timeout:
            try:
                response = self.session.get(health_url)
                if response.status_code == 200:
                    print("API is ready!")
                    return True
            except requests.RequestException:
                pass
            time.sleep(2)

        print("API failed to start within timeout")
        return False

    def run_test(self, test):
        method = test['method']
        endpoint = test['endpoint']
        url = self.base_url + endpoint
        data = test.get('data')
        expected_status = test.get('expected_status')
        expected_response = test.get('expected_response')

        print(f"\nTesting: {test['name']}")
        print(f"URL: {method} {url}")

        if data:
            print(f"Data: {json.dumps(data, indent=2)}")

        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            elif method == 'PUT':
                response = self.session.put(url, json=data)
            elif method == 'DELETE':
                response = self.session.delete(url)
            else:
                print(f"Unsupported method: {method}")
                return False

            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")

            # Check status
            if expected_status and response.status_code != expected_status:
                print(f"❌ Expected status {expected_status}, got {response.status_code}")
                return False

            # Check response content if expected
            if expected_response:
                try:
                    response_json = response.json()
                    if response_json != expected_response:
                        print(f"❌ Response mismatch")
                        print(f"Expected: {expected_response}")
                        print(f"Got: {response_json}")
                        return False
                    else:
                        print("✅ Response matches expected")
                except json.JSONDecodeError:
                    print("❌ Expected JSON response but got non-JSON")
                    return False
            else:
                # If no expected response provided, check if status is success (1xx, 2xx, 3xx)
                if 100 <= response.status_code < 400:
                    print("✅ Status code indicates success")
                else:
                    print(f"❌ Unexpected status code: {response.status_code}")
                    return False

            return True

        except requests.RequestException as e:
            print(f"❌ Request failed: {e}")
            return False

    def run_all_tests(self):
        passed = 0
        total = len(self.tests)

        for test in self.tests:
            if self.run_test(test):
                passed += 1

        print(f"\n{'='*50}")
        print(f"Test Results: {passed}/{total} passed")

        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print("❌ Some tests failed")
            return False

def main():
    config_file = sys.argv[1] if len(sys.argv) > 1 else 'config.json'
    tester = APITester(config_file=config_file)

    if not tester.wait_for_health_check():
        print("Backend not ready, exiting")
        sys.exit(1)

    success = tester.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
