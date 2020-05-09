package helper;

public class MathHelper {

    /**
 * @return number from 100 to +0 (for i being an integer)
 */
    public static double reverseAbsFn(double x) {
        return 100d / (Math.abs(x) + 1);
    }

    public static int sumabs(int a, int b) {
        return Math.abs(a) + Math.abs(b);
    }

}
