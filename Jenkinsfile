pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/AmetDev/polyteh_simf_front.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Restart with PM2') {
            steps {
                sh '''
                    # Останавливаем и удаляем предыдущий процесс (если есть)
                    pm2 stop frontend-app || true
                    pm2 delete frontend-app || true

                    # Запускаем приложение 
                    pm2 start npm --name "frontend-app" -- run start  # или "npm run prod"

                    # Сохраняем список процессов PM2
                    pm2 save
                    pm2 startup 
                '''
            }
        }
    }

    post {
        always {
            // Очистка (если нужно)
            sh 'pm2 list'
        }
    }
}
